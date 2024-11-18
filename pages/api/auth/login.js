// pages/api/auth/login.js
import { connectToDatabase } from '../../../utils/mongodb';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;
        const { db } = await connectToDatabase();

        const user = await db.collection('users').findOne({ email });
        
        if (!user || password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Include more comprehensive user data
        const userData = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            pt: user.pt,
            stats: user.stats,
            workouts: user.workouts
        }

        console.log('Login API - Sending user data:', userData)

        // Create a secure token
        const token = Buffer.from(JSON.stringify({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        })).toString('base64');

        res.setHeader('Set-Cookie', serialize('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600,
            path: '/'
        }));

        res.status(200).json({ user: userData });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
