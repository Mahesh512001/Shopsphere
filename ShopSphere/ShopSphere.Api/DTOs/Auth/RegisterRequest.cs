using System.ComponentModel.DataAnnotations;

namespace ShopSphere.Api.DTOs.Auth;

public class RegisterRequest
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Phone]
    public string? PhoneNumber { get; set; }

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    // Public registration permits only Customer or Seller.
    public string Role { get; set; } = "Customer";
}
