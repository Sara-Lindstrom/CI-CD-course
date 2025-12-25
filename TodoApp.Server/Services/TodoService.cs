using Microsoft.AspNetCore.Http.HttpResults;
using System.Text.Json;
using TodoApp.Server.Models;
using Microsoft.Extensions.Configuration;

namespace TodoApp.Server.Services;

public class TodoService
{
    private readonly string _filePath;
    private List<TodoItem> _items;
    private int _counter;

    public TodoService(IConfiguration configuration)
    {
        _filePath = configuration["TodoStorage:FilePath"]
            ?? throw new InvalidOperationException("Todo file path not configured");

        _items = LoadTodos();
        _counter = _items.Any() ? _items.Max(t => t.Id) + 1 : 1;
    }

    private List<TodoItem> LoadTodos()
    {
        if (!File.Exists(_filePath)) return new List<TodoItem>();
        var json = File.ReadAllText(_filePath);

        if(json.Length != 0)
        {
            return JsonSerializer.Deserialize<List<TodoItem>>(json);
        }

        return new List<TodoItem>();
    }

    private void SaveTodos()
    {
        var json = JsonSerializer.Serialize(_items, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(_filePath, json);
    }

    //CRUD

    public TodoItem Add(TodoItem item)
    {
        while (GetById(_counter) != null)
        {
            _counter++;
        }

        item.Id = _counter++;
        item.IsDone = false;
        item.createdDate = DateTime.Now;

        _items.Add(item);
        SaveTodos();

        return item;
    }

    public List<TodoItem> GetAll() => _items;

    public TodoItem? GetById(int id) => _items.FirstOrDefault(t => t.Id == id);

    public TodoItem? Update(TodoItem updated)
    {
        if (updated != null)
        {
            var item = GetById(updated.Id);
            if (item == null) return null;

            item.Title = updated.Title;
            item.IsDone = updated.IsDone;
            item.IsUrgent = updated.IsUrgent;

            SaveTodos();

            return item;
        }
        return null;

    }

    public void Delete(int id)
    {
        var item = GetById(id);
        if (item != null)
        {
            _items.Remove(item);
            SaveTodos();
        }
    }

}
