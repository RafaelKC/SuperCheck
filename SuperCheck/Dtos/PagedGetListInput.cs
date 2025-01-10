namespace SuperCheck.Dtos;

public class PagedGetListInput
{
    public int PageSize { get; set; } = 15;
    public int SkipCount { get; set; } = 0;
}