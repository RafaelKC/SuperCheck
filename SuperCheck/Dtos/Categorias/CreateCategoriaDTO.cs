using System.ComponentModel.DataAnnotations;

namespace SuperCheck.Dtos.Categorias;

public class CreateCategoriaDTO
{
    [Required(ErrorMessage = "Descrição é obrigatória")]
    [StringLength(200, ErrorMessage = "Descrição deve ter no máximo 200 caracteres e no mínimo", MinimumLength = 1)]
    public string Descricao { get; set; }
}