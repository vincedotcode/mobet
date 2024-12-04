import * as React from "react";

interface VerifyEmailTemplateProps {
  firstName: string;
  verificationUrl: string;
}

export const VerifyEmailTemplate: React.FC<Readonly<VerifyEmailTemplateProps>> = ({ firstName, verificationUrl }) => (
  <div style={{ 
    fontFamily: "'Arial Black', Helvetica, sans-serif",
    padding: "40px",
    backgroundColor: "#fff4e0",
    color: "#000",
    border: "4px solid #000",
    maxWidth: "600px",
    margin: "0 auto",
  }}>
    <h1 style={{ 
      fontSize: "36px", 
      marginBottom: "20px",
      textTransform: "uppercase",
      borderBottom: "4px solid #000",
      paddingBottom: "10px",
    }}>
      Welcome, {firstName}!
    </h1>
    <p style={{ 
      fontSize: "18px", 
      lineHeight: "1.5",
      marginBottom: "30px",
    }}>
      Thanks for signing up! Please verify your email address by clicking the link below:
    </p>
    <a
      href={verificationUrl}
      style={{ 
        backgroundColor: "#FD9745",
        color: "#000",
        padding: "15px 30px",
        fontSize: "20px",
        textDecoration: "none",
        textTransform: "uppercase",
        fontWeight: "bold",
        border: "3px solid #000",
        display: "inline-block",
        marginBottom: "30px",
        boxShadow: "5px 5px 0px #000",
      }}
    >
      Verify your email
    </a>
    <p style={{ 
      fontSize: "16px", 
      marginBottom: "20px",
      borderTop: "2px solid #000",
      paddingTop: "20px",
    }}>
      If you did not sign up for this account, please ignore this email.
    </p>
    <p style={{ 
      fontSize: "18px", 
      fontWeight: "bold",
    }}>
      Thank you!
    </p>
  </div>
);

