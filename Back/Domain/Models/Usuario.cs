using Back.Domain.Models;

namespace Back.Domain.Models;

public abstract class Usuario
{
    public string Nombre { get; private set; }
    public string Apellido { get; private set; }
    public string Email { get; private set; }
    public string Password { get; private set; }
    public string DNI { get; private set; }

    public Usuario()
    {
    }

    public Usuario(string nombre, string apellido, string email, string password, string dni)
    {
        Nombre = nombre;
        Apellido = apellido;
        Email = email;
        Password = password;
        DNI = dni;
    }
}

public class Supervisor : Usuario
{

    public Supervisor()
    {
    }

    public Supervisor(string nombre, string apellido, string email, string password, string dni) : base(nombre, apellido, email, password, dni){}
}

public class Operador : Usuario
{

    public Operador(){}

    public Operador(string nombre, string apellido, string email, string password, string dni) : base(nombre, apellido, email, password, dni)
    {
    }
}

public class Transportista : Usuario
{

    public Transportista()
    {
    }

    public Transportista(string nombre, string apellido, string email, string password, string dni) : base(nombre, apellido, email, password, dni)
    {
    }
}