using Microsoft.Extensions.Configuration;
using System.Text.Json;
using TodoApp.Server.Models;
using TodoApp.Server.Services;

namespace TodoApp.Server.Tests;

public class UnitTests
{
    private readonly IConfiguration _configuration;
    private readonly string _storagePath;

    public UnitTests()
    {
        _configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: false)
            .Build();

        _storagePath = _configuration["TodoStorage:FilePath"]
            ?? throw new InvalidOperationException("TodoStorage:FilePath missing");

        Directory.CreateDirectory(Path.GetDirectoryName(_storagePath)!);
    }

    private TodoService NewService() => new TodoService(_configuration);

    private void WriteTodos(params TodoItem[] items)
    {
        File.WriteAllText(_storagePath, JsonSerializer.Serialize(items.ToList()));
    }

    private static List<TodoItem> ReadTodos(string path)
    {
        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<List<TodoItem>>(json) ?? new List<TodoItem>();
    }

    private TodoService emulateServiceWithDB()
    {
        WriteTodos(new TodoItem { Id = 1, Title = "Test", IsDone = false, IsUrgent = true, createdDate = DateTime.Now });
        var service = NewService();
        return service;
    }

    [Fact]
    public void Add_Writes_To_File()
    {
        WriteTodos();
        var service = NewService();

        var todo = new TodoItem
        {
            Id = 0,
            Title = "Test",
            IsDone = true,
            IsUrgent = true
        };

        var result = service.Add(todo);

        Assert.Equal(1, result.Id);
        Assert.False(result.IsDone);

        var persisted = ReadTodos(_storagePath);
        Assert.Single(persisted);
        Assert.Equal("Test", persisted[0].Title);
        Assert.False(persisted[0].IsDone);
        Assert.NotEqual(0, persisted[0].Id);
    }

    [Fact]
    public void GetById_Returns_Item_WhenFound()
    {
        var service = emulateServiceWithDB();

        var item = service.GetById(1);
        Assert.NotNull(item);
        Assert.Equal("Test", item!.Title);

        var noItem = service.GetById(0);
        Assert.Null(noItem);
    }

    [Fact]
    public void Update_Updates_Item_In_File()
    {
        var service = emulateServiceWithDB();

        var item = service.GetById(1);
        Assert.NotNull(item);

        item!.Title = "Changed";
        item.IsDone = true;
        item.IsUrgent = false;

        var result = service.Update(item);
        Assert.Equal(1, result!.Id);
        Assert.False(result.IsUrgent);
        Assert.True(result.IsDone);
        Assert.Equal("Changed", result.Title);

        var noResult = service.GetById(0);
        Assert.Null(noResult);
        Assert.Null(service.Update(noResult));
        Assert.Null(service.Update(new TodoItem { Id = 0, Title = "X", IsDone = false, IsUrgent = false }));
    }

    [Fact]
    public void GetAll_Returns_ItemList_WhenFound()
    {
        WriteTodos();
        var service = NewService();
        Assert.Empty(service.GetAll());

        var serviceWithDB = emulateServiceWithDB();   
        Assert.Single(serviceWithDB.GetAll());
    }


    [Fact]
    public void Delete_Removes_Item_WhenFound()
    {
        var service = emulateServiceWithDB();

        service.Delete(0);
        var items = ReadTodos(_storagePath);
        Assert.Single(items);

        service.Delete(1);
        var persisted = ReadTodos(_storagePath);
        Assert.Empty(persisted);

    }
}