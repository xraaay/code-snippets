//Service File
public UserLogin Login(UserEmailPass user)
{
    string decodeEmail = HttpUtility.UrlDecode(user.Email);

    var userSalt = GetSalt(user.Email);
    string passwordHash = _cryptographyService.Hash(user.Password, userSalt.Salt, HASH_ITERATION_COUNT);

    UserLogin response = null;

    if (!String.IsNullOrEmpty(userSalt.Email) && userSalt.Password == passwordHash)
    {
        response = Get(user.Email, passwordHash);

        if(response != null)
        {
            _authenticationService.LogIn(response);
        }

    }
    return response;

}

//Owin Authentication Service
public void LogIn(IUserAuthData user)
{
    ClaimsIdentity identity = new ClaimsIdentity(DefaultAuthenticationTypes.ApplicationCookie);

    identity.AddClaim(new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider"
                        , _title
                        , ClaimValueTypes.String));
    var claims = new List<Claim>();
    claims.Add(new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", user.Id.ToString(), ClaimValueTypes.Integer));
    claims.Add(new Claim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", user.UserTypeId.ToString(), ClaimValueTypes.Integer));
    claims.Add(new Claim("IsMentorApproved", user.IsMentorApproved.ToString(), ClaimValueTypes.Boolean));
    claims.Add(new Claim("IsConfirmed", user.IsConfirmed.ToString(), ClaimValueTypes.Boolean));
    identity.AddClaims(claims);

    AuthenticationProperties props = new AuthenticationProperties
    {
        IsPersistent = true,
        IssuedUtc = DateTime.UtcNow,    
        ExpiresUtc = DateTime.UtcNow.AddDays(60),
        AllowRefresh = true
    };

    HttpContext.Current.GetOwinContext().Authentication.SignIn(props, identity);
}

//Get Current Logged In User
public static UserLogin GetCurrentUser(this IIdentity identity)
{
    UserLogin baseUser = null;

    if (identity == null) { throw new ArgumentNullException("identity"); }

    if (identity.IsAuthenticated)
    {   
        ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;

        if (claimsIdentity != null)
        {
            baseUser = ExtractUser(claimsIdentity);
        }
    }


    return baseUser;
}

//Extract Claims
private static UserLogin ExtractUser(ClaimsIdentity identity)
{
    UserLogin baseUser = new UserLogin();

    foreach (var claim in identity.Claims)
    {
        switch (claim.Type)
        {

            case "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
                int id = 0;
                if(int.TryParse(claim.Value, out id)){
                    baseUser.Id = id;
                }
                break;

            case "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
                int userTypeId = 0;
                if(int.TryParse(claim.Value, out userTypeId))
                {
                    baseUser.UserTypeId = userTypeId;
                }
                break;

            case "IsMentorApproved":
                bool isMentorApproved;
                if(bool.TryParse(claim.Value, out isMentorApproved))
                {
                    baseUser.IsMentorApproved = isMentorApproved;
                }
                break;

            case "IsConfirmed":
                bool isConfirmed;
                if(bool.TryParse(claim.Value, out isConfirmed))
                {
                    baseUser.IsConfirmed = isConfirmed;
                }
                break;

        }

    }

    return baseUser;
}
