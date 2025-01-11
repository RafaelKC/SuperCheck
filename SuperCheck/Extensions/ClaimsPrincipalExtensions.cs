using System.Security.Claims;

namespace SuperCheck.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        var userId = principal?.Claims?.FirstOrDefault(c => c.Type == "Id")?.Value;
        return string.IsNullOrWhiteSpace(userId) ? null : Guid.Parse(userId);
    }
}