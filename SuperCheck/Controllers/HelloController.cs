using Microsoft.AspNetCore.Mvc;

namespace SuperCheck.Controllers;

[Route("api")]
public class HelloController: ControllerBase
{
    public class HelloWorld
    {
        public string Hello { get; set; }
    }
    
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new HelloWorld
        {
            Hello = "World!"
        });
    }
}