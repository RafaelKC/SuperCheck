using SuperCheck.Enums;

namespace SuperCheck.Entities;

public class Usuario
{
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public UsuarioRole Role { get; set; }
}