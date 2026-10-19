using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockShoppingAPI.Models.Entity;

[Table("TB_Product")]
public class TB_Product
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int StockId { get; set; }

    [Required]
    public string Name { get; set; }

    [StringLength(500)]
    public string Description { get; set; }

    [StringLength(200)]
    public string ImageUrl { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [ForeignKey("StockId")]
    public TB_Stock Stock { get; set; }
}
