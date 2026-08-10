using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ShopSphere.Api.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 character.")]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Price is required.")]
        [Range(1, 1000000, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }
        [Required(ErrorMessage = "Stock is required.")]
        [Range(0, 10000, ErrorMessage = "Stock cannot be negative.")]
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        [StringLength(1000)]
        public string? Description { get; set; }

        public string? SellerUserId { get; set; }

        [JsonIgnore]
        public ApplicationUser? Seller { get; set; }
    }
}
