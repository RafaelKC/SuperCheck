namespace SuperCheck.Entities;

public class UserCredential
{
    public Guid UserId { get; set; }
    public string Login { get; set; }
    public string Password { get; set; }
    
    public Usuario Usuario { get; set; }
}