using Azure.Core;
using SuperCheck.Entities;
using SuperCheck.Enums;

namespace SuperCheck.Dtos.Usuarios;

public class CreateUsuarioDto
{
    public string Nome { get; set; }
    public UsuarioRole Role { get; set; }
    
    public UserCredential? Credential { get; set; }
}