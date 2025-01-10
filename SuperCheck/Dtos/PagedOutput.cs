namespace SuperCheck.Dtos;

public class PagedOutput<T>
{
    public int TotalCount { get; set; }
    public List<T> Items { get; set; }
}