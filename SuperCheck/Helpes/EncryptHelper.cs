using System.Security.Cryptography;

namespace SuperCheck.Helpes;

public class EncryptHelper
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 10000;

    public static string Hash(string value)
    {
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[SaltSize];
        rng.GetBytes(salt);

        var key = new Rfc2898DeriveBytes(value, salt, Iterations, HashAlgorithmName.SHA256);
        var hash = key.GetBytes(KeySize);

        var result = new byte[SaltSize + KeySize];
        Buffer.BlockCopy(salt, 0, result, 0, SaltSize);
        Buffer.BlockCopy(hash, 0, result, SaltSize, KeySize);

        return Convert.ToBase64String(result);
    }

    public static bool Verify(string value, string hashedValue)
    {
        var fullHash = Convert.FromBase64String(hashedValue);

        var salt = new byte[SaltSize];
        Buffer.BlockCopy(fullHash, 0, salt, 0, SaltSize);

        var key = new Rfc2898DeriveBytes(value, salt, Iterations, HashAlgorithmName.SHA256);
        var hash = key.GetBytes(KeySize);

        for (int i = 0; i < KeySize; i++)
        {
            if (hash[i] != fullHash[SaltSize + i])
                return false;
        }

        return true;
    }
}