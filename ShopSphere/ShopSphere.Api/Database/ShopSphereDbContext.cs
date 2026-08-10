using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShopSphere.Api.Models;

namespace ShopSphere.Api.Database
{
    public class ShopSphereDbContext
        : IdentityDbContext<ApplicationUser>
    {
        public ShopSphereDbContext(
            DbContextOptions<ShopSphereDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
    }
}