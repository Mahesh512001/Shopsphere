using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopSphere.Api.Database;
using ShopSphere.Api.Models;

namespace ShopSphere.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ShopSphereDbContext _context;

        public ProductsController(ShopSphereDbContext context)
        {
            _context = context;
        }

        // Public product list.
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return Ok(await _context.Products
                .AsNoTracking()
                .OrderByDescending(product => product.Id)
                .ToListAsync());
        }

        // Admin sees all products. Seller sees only products created by them.
        [Authorize(Roles = "Seller,Admin")]
        [HttpGet("manage")]
        public async Task<ActionResult<IEnumerable<Product>>> GetManageProducts()
        {
            IQueryable<Product> query = _context.Products.AsNoTracking();

            if (!User.IsInRole("Admin"))
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                query = query.Where(product => product.SellerUserId == userId);
            }

            return Ok(await query
                .OrderByDescending(product => product.Id)
                .ToListAsync());
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            return Ok(product);
        }

        [Authorize(Roles = "Seller,Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct(Product product)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            product.Id = 0;
            product.SellerUserId = userId;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetProduct),
                new { id = product.Id },
                product
            );
        }

        [Authorize(Roles = "Seller,Admin")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Product>> UpdateProduct(
    int id,
    Product updatedProduct)
        {
            var existingProduct = await _context.Products.FindAsync(id);

            if (existingProduct == null)
            {
                return NotFound("Product not found.");
            }

            if (!CanManage(existingProduct))
            {
                return Forbid();
            }

            existingProduct.Name = updatedProduct.Name;
            existingProduct.Price = updatedProduct.Price;
            existingProduct.Stock = updatedProduct.Stock;
            existingProduct.ImageUrl = updatedProduct.ImageUrl;
            existingProduct.Description = updatedProduct.Description;

            await _context.SaveChangesAsync();

            return Ok(existingProduct);
        }

        [Authorize(Roles = "Seller,Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            if (!CanManage(product))
            {
                return Forbid();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CanManage(Product product)
        {
            if (User.IsInRole("Admin"))
            {
                return true;
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return !string.IsNullOrWhiteSpace(userId)
                && product.SellerUserId == userId;
        }
    }
}