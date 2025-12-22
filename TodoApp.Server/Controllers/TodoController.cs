using Microsoft.AspNetCore.Mvc;
using TodoApp.Server.Models;
using TodoApp.Server.Services;

[ApiController]
[Route("[controller]")]
public class TodoController : Controller
{
    public readonly TodoService _service;

    public TodoController(TodoService service)
    {
        _service = service;
    }

    [HttpPost("add")]
    public IActionResult Create([FromBody] TodoItem item)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = _service.Add(item);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error adding todo: {ex.Message}");
        }
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        try
        {
            var todos = _service.GetAll();
            return Ok(todos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving todos: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        try
        {
            var todo = _service.GetById(id);
            if (todo == null) return NotFound();
            return Ok(todo);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving todo: {ex.Message}");
        }
    }

    [HttpPost("update")]
    public IActionResult Edit([FromBody] TodoItem updated)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var exists = _service.GetById(updated.Id);
            if (exists == null) return NotFound();

            var result = _service.Update(updated);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error updating todo: {ex.Message}");
        }
    }

    [HttpPost("delete")]
    public IActionResult DeleteConfirmed([FromBody] int id)
    {
        try
        {
            var exists = _service.GetById(id);
            if (exists == null) return NotFound();

            _service.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error deleting todo: {ex.Message}");
        }
    }
}

