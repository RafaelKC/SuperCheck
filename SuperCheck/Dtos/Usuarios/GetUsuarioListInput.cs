using SuperCheck.Enums;

namespace SuperCheck.Dtos.Usuarios;

public class GetUsuarioListInput: PagedAndFilteredGetListInput
{
    public List<UsuarioRole>? Roles { get; set; } = new();
}