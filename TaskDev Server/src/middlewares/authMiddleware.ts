import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


// EXTEND EXPRESS REQUEST
// Adds user data to req object after token is verified

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}


// PROTECT MIDDLEWARE
// Reads JWT from httpOnly cookie (not Authorization header) I'm choosing to use cookies for auth because
//  they are more secure than localStorage and easier to manage than sessionStorage. Cookies can be httpOnly,
//  which means they cannot be accessed by JavaScript, reducing the risk of XSS attacks. 
// They also have built-in expiration and can be set to be sent only over HTTPS.


export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Read token from cookie
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized - please log in",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");

    // Verify the token
    const decoded = jwt.verify(token, secret) as {
      id: string;
      role: string;
    };

    // Attach user info to the request object
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized - invalid or expired token",
    });
  }
};


// ADMIN ONLY MIDDLEWARE
// Restricts route to admin users only
// NOT NEEDED FOR THIS TASK BUT WILL BE USEFUL FOR FUTURE FEATURES LIKE ADMIN DASHBOARD 
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Access denied - admin only",
    });
    return;
  }
  next();
};