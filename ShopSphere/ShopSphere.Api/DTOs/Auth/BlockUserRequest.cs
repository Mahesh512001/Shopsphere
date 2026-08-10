using System.ComponentModel.DataAnnotations;

namespace ShopSphere.Api.DTOs.Auth;

public class BlockUserRequest
{
    [Required]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;
}
