package com.todolist.backend.security.jwt;

import com.todolist.backend.security.services.AuthUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.sql.Date;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiryDays}")
    private Long jwtExpirationDays;

    @Value("${app.jwt.cookieName}")
    private String cookieName;

    public String generateTokenFromPrincipal(AuthUserDetails userDetails, Set<String> roles) {

        UUID userId = userDetails.getUserId();
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(userId.toString())
                .claim("roles", roles)
                .claim("email", userDetails.email())
                .signWith(key())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(Duration.ofDays(jwtExpirationDays))))
                .compact();
    }

    public Claims getClaims(String jwt) {
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }

    public String getEmails(Claims claims) {
        return (String) claims
                .get("email");
    }

    public UUID getUserId(Claims claims) {
        return UUID.fromString(claims.getSubject());
    }

    public Set<String> getRoles(Claims claims) {
        Object raw = claims.get("roles");
        if (raw instanceof Collection<?> c)
            return c.stream()
                    .map(String::valueOf)
                    .collect(Collectors.toSet());

        if (raw instanceof String s)
            return Arrays.stream(s.split("\\s+"))
                    .filter(r -> !r.isBlank())
                    .collect(Collectors.toSet());
        return Set.of();
    }

    public Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public ResponseCookie getCookie(String jwt) {
        return ResponseCookie.from(cookieName, jwt)
                .maxAge(Duration.ofDays(jwtExpirationDays))
                .httpOnly(true)
                .secure(false)
                .path("/")
                .build();
    }

    public boolean isValid(String jwt) {
        try {
            Jwts.parser().verifyWith((SecretKey) key())
                    .build()
                    .parseSignedClaims(jwt);
            return true;
        } catch (MalformedJwtException e) {
            System.err.println("Malformed Token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("Token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("Token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("Illegal argument in token: " + e.getMessage());
        }
        return false;
    }

    public ResponseCookie getClearJwt() {
        return ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(false)
                .maxAge(0)
                .path("/")
                .build();
    }
}
