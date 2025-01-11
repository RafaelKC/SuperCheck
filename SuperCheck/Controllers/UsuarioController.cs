using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperCheck.Dtos;
using SuperCheck.Dtos.Categorias;
using SuperCheck.Dtos.Usuarios;
using SuperCheck.Entities;
using SuperCheck.Services;

namespace SuperCheck.Controllers;

[Route("usuarios")]
[Authorize]
public class UsuarioController: ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuarioController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedOutput<Usuario>>> GetAll([FromQuery] GetUsuarioListInput input)
    {
        var usuarios = await _usuarioService.GetList(input);
        return Ok(usuarios);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Usuario>> GetById([FromRoute] Guid id)
    {
        var usuario = await _usuarioService.GetById(id);
        return usuario != null ? Ok(usuario) : NotFound();
    }

    [HttpPost]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult<Usuario>> Create([FromBody] CreateUsuarioDto createDto)
    {
        var categoria = await _usuarioService.Create(createDto);
        return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
    }
    
    [HttpPost("motorista")]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult<Usuario>> CreateMotorista([FromBody] CreateMoristaDto createDto)
    {
        var categoria = await _usuarioService.CreateMotorista(createDto);
        return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
    }
}