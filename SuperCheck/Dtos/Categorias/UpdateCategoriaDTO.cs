using System.ComponentModel.DataAnnotations;

namespace SuperCheck.Dtos.Categorias;

public class UpdateCategoriaDTO
{
    [Required(ErrorMessage = "Descrição é obrigatória")]
    [StringLength(200, ErrorMessage = "Descrição deve ter no máximo 200 caracteres", MinimumLength = 1)]
    public string Descricao { get; set; }
}