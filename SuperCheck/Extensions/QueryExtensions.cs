using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SuperCheck.Dtos;

namespace SuperCheck.Extensions;

public static class QueryExtensions
{
    public static IQueryable<T> WhereIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> predicate)
    {
        return condition ? query.Where(predicate) : query;
    }

    public static async Task<PagedOutput<T>> ToPagedOutput<T>(this IQueryable<T> query, PagedGetListInput input)
    {
        var count = await query.CountAsync();
        var items = await query.Skip(input.SkipCount).Take(input.PageSize).ToListAsync();

        return new PagedOutput<T>
        {
            Items = items,
            TotalCount = count
        };
    }
}