using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ShopSphere.Api.Database;
using ShopSphere.Api.Models;
using ShopSphere.Api.Services;

namespace ShopSphere.Api
{
    public class Program
    {
        // Main must be async because IdentitySeeder uses await.
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // --------------------------------------------------
            // Controllers and Swagger
            // --------------------------------------------------

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // --------------------------------------------------
            // SQL Server and EF Core
            // --------------------------------------------------

            builder.Services.AddDbContext<ShopSphereDbContext>(options =>
            {
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                );
            });

            // --------------------------------------------------
            // ASP.NET Core Identity
            // --------------------------------------------------

            builder.Services
                .AddIdentityCore<ApplicationUser>(options =>
                {
                    options.User.RequireUniqueEmail = true;

                    options.Password.RequiredLength = 8;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireDigit = true;
                    options.Password.RequireNonAlphanumeric = true;

                    options.Lockout.AllowedForNewUsers = true;
                    options.Lockout.MaxFailedAccessAttempts = 5;
                    options.Lockout.DefaultLockoutTimeSpan =
                        TimeSpan.FromMinutes(15);
                })
                .AddRoles<IdentityRole>()
                .AddSignInManager()
                .AddEntityFrameworkStores<ShopSphereDbContext>()
                .AddDefaultTokenProviders();

            // --------------------------------------------------
            // JWT configuration
            // --------------------------------------------------

            var jwtKey = builder.Configuration["Jwt:Key"]
                ?? throw new InvalidOperationException(
                    "Jwt:Key is missing from appsettings.json."
                );

            var jwtIssuer = builder.Configuration["Jwt:Issuer"]
                ?? throw new InvalidOperationException(
                    "Jwt:Issuer is missing from appsettings.json."
                );

            var jwtAudience = builder.Configuration["Jwt:Audience"]
                ?? throw new InvalidOperationException(
                    "Jwt:Audience is missing from appsettings.json."
                );

            builder.Services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme =
                        JwtBearerDefaults.AuthenticationScheme;

                    options.DefaultChallengeScheme =
                        JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters =
                        new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidIssuer = jwtIssuer,

                            ValidateAudience = true,
                            ValidAudience = jwtAudience,

                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey =
                                new SymmetricSecurityKey(
                                    Encoding.UTF8.GetBytes(jwtKey)
                                ),

                            ValidateLifetime = true,

                            // Token expires at the exact expiry time.
                            ClockSkew = TimeSpan.Zero,

                            NameClaimType = ClaimTypes.Name,
                            RoleClaimType = ClaimTypes.Role
                        };

                    /*
                       This checks the database on every protected request.

                       Therefore, when Admin blocks a Customer or Seller,
                       their existing JWT will also stop working.
                    */
                    options.Events = new JwtBearerEvents
                    {
                        OnTokenValidated = async context =>
                        {
                            var userId = context.Principal?
                                .FindFirstValue(
                                    ClaimTypes.NameIdentifier
                                );

                            if (string.IsNullOrWhiteSpace(userId))
                            {
                                context.Fail("User ID is missing.");
                                return;
                            }

                            var userManager = context.HttpContext
                                .RequestServices
                                .GetRequiredService<
                                    UserManager<ApplicationUser>
                                >();

                            var user =
                                await userManager.FindByIdAsync(
                                    userId
                                );

                            if (user == null)
                            {
                                context.Fail(
                                    "User account does not exist."
                                );

                                return;
                            }

                            if (!user.IsActive)
                            {
                                context.Fail(
                                    "User account is blocked."
                                );
                            }
                        }
                    };
                });

            builder.Services.AddAuthorization();

            // JWT token creation service
            builder.Services.AddScoped<JwtTokenService>();

            // --------------------------------------------------
            // CORS for React
            // --------------------------------------------------

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // --------------------------------------------------
            // HTTP request pipeline
            // --------------------------------------------------

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();

                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint(
                        "/swagger/v1/swagger.json",
                        "ShopSphere API v1"
                    );
                });
            }

            app.UseStaticFiles();

            app.UseHttpsRedirection();

            app.UseCors("AllowReactApp");

            // Authentication must come before Authorization.
            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();

            // --------------------------------------------------
            // Create roles and default Admin
            // --------------------------------------------------
            // Place this after app.MapControllers() and before app.Run().

            using (var scope = app.Services.CreateScope())
            {
                await IdentitySeeder.SeedAsync(
                    scope.ServiceProvider,
                    builder.Configuration
                );
            }

            app.Run();
        }
    }
}