using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperCheck.Enums;
using SuperCheck.Infra.Authentication;
using SuperCheck.Infra.Authentication.Dtos;

namespace SuperCheck.Controllers;

[Route("auth")]
public class AuthController: ControllerBase
{
    private readonly ILoginService _loginService;

    public AuthController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginOutput>> Login([FromBody] LoginInput input)
    {
        var result = await _loginService.Login(input);
        return result.Success ? Ok(result) : BadRequest();
    }
}