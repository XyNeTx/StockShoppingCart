using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace StockShoppingAPI.Models.Entity;

[Table("TB_Stock")]
public class TB_Stock
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public DateTime LastUpdated { get; set; }
}
