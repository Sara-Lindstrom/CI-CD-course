using System.ComponentModel.DataAnnotations;

namespace TodoApp.Server.Models;

public class TodoItem
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Title is required")]
    [StringLength(50, ErrorMessage = "Max 50 characters")]
    public string Title { get; set; }
    public bool IsDone { get; set; }
    public bool IsUrgent { get; set; }
    public DateTime createdDate { get; set; }
}
