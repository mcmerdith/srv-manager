module cloudflare {
  type ApiToken {
    required user: default::User;
    required key: str;
    required name: str {
      default := "Cloudflare Token";
    }
  }
}