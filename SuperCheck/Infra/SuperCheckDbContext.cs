using Microsoft.EntityFrameworkCore;
using SuperCheck.Entities;

namespace SuperCheck.Infra;

public class SuperCheckDbContext: DbContext
{
    public SuperCheckDbContext(DbContextOptions<SuperCheckDbContext> options)
        : base(options)
    {
    }

    public DbSet<Checklist> Checklists { get; set; }
    public DbSet<ChecklistItem> ChecklistItems { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<ChecklistTemplate> Templates { get; set; }
    public DbSet<TemplateItem> TemplateItems { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Caminhao> Caminhoes { get; set; }
    
    public DbSet<SeederManager> SeederManagers { get; set; }
    public DbSet<UserCredential> UserCredentials { get; set; }
    
     protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Checklist>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Categoria)
                .WithMany()
                .HasForeignKey(e => e.CategoriaId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Template)
                .WithMany()
                .HasForeignKey(e => e.TemplateId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Caminhao)
                .WithMany()
                .HasForeignKey(e => e.CaminhaoId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Motorista)
                .WithMany()
                .HasForeignKey(e => e.MotoristaId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Executor)
                .WithMany()
                .HasForeignKey(e => e.ExecutorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Property(e => e.Observacao)
                .HasMaxLength(500);
        });

        modelBuilder.Entity<ChecklistItem>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne<Checklist>()
                .WithMany(c => c.Items)
                .HasForeignKey(e => e.ChecklistId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Nome)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Observacao)
                .HasMaxLength(500);
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Descricao)
                .IsRequired()
                .HasMaxLength(200);
        });

        modelBuilder.Entity<ChecklistTemplate>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Categoria)
                .WithMany()
                .HasForeignKey(e => e.CategoriaId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.Property(e => e.Nome)
                .IsRequired()
                .HasMaxLength(200);
        });

        modelBuilder.Entity<TemplateItem>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne<ChecklistTemplate>()
                .WithMany(t => t.Items)
                .HasForeignKey(e => e.TemplateId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Nome)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Observacao)
                .HasMaxLength(500);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome)
                .IsRequired()
                .HasMaxLength(200);
        });
        
        modelBuilder.Entity<Caminhao>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Descricao)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Placa)
                .IsRequired()
                .HasMaxLength(8);

            entity.HasIndex(e => e.Placa)
                .IsUnique();
        });

        modelBuilder.Entity<SeederManager>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<UserCredential>(entity =>
        {
            entity.HasKey(e => e.UserId);
            
            entity.HasIndex(e => e.Login)
                .IsUnique();
            entity.HasOne(e => e.Usuario)
                .WithOne(e => e.Credential)
                .HasForeignKey<UserCredential>(e => e.UserId)
                .HasPrincipalKey<Usuario>(e => e.Id);
        });
    }
}