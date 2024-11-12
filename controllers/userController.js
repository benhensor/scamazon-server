import axios from 'axios'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as yup from 'yup'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const passwordRules =
	/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,20}$/

const registrationSchema = yup.object().shape({
	firstname: yup
		.string()
		.min(3, 'Firstname must be at least 3 characters')
		.max(20, 'Firstname cannot exceed 20 characters')
		.required('Required'),
	lastname: yup
		.string()
		.min(3, 'Lastname must be at least 3 characters')
		.max(20, 'Lastname cannot exceed 20 characters')
		.required('Required'),
	email: yup
		.string()
		.email('Please enter a valid email')
		.required('Required'),
	password: yup
		.string()
		.min(6, 'Password must be at least 6 characters')
		.matches(passwordRules, {
			message: 'Please create a stronger password',
		})
		.required('Required'),
})

export const registerUser = async (req, res) => {
	const { fullname, email, password } = req.body
	const [firstname, lastname = ''] = fullname.split(' ')
	try {
		console.log('registering user')
		await registrationSchema.validate({
			firstname,
			lastname,
			email,
			password,
		})
		const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10
		const hashedPassword = await bcrypt.hash(password, saltRounds)

		await User.create({
			first_name: firstname,
			last_name: lastname,
			email,
			password: hashedPassword,
		})
		res.status(201).json({ message: 'User created successfully' })
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			console.log(error.errors)
			res.status(400).json({ error: error.message })
		} else {
			return res.status(500).json({ error: error.message })
		}
	}
}

const loginSchema = yup.object().shape({
	email: yup
		.string()
		.email('Please enter a valid email')
		.required('Email is required'),
	password: yup.string().required('Password is required'),
})

export const loginUser = async (req, res) => {
	const { email, password } = req.body
	try {
		await loginSchema.validate({ email, password })
		const user = await User.findOne({ where: { email } })

		if (!user) return res.status(404).json({ error: 'User not found' })
		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch)
			return res.status(401).json({ error: 'Invalid credentials' })

		console.log('User logged in:', user)

		const token = jwt.sign(
			{ user_id: user.user_id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		)

		// Clear existing cookie and set new token
		res.clearCookie('authToken') // Ensure this works before setting a new token
		res.cookie('authToken', token, {
			httpOnly: true, // Server-only access
			secure: process.env.NODE_ENV === 'production', // Secure in production
			sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Lax for local dev
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
			path: '/', // Make it accessible site-wide
		})

		// Production cookie settings
		// Production (https, stricter settings)
		// res.cookie('authToken', token, {
		// 	httpOnly: true, // Server-only access for security
		// 	secure: true, // Ensure the cookie is sent only over HTTPS
		// 	sameSite: 'None', // For cross-site requests, use None; else 'Lax' or 'Strict' can be safer.
		// 	maxAge: 24 * 60 * 60 * 1000, // 24 hours
		// 	path: '/', // Make the cookie accessible across your site
		// })

		res.json({ user })
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return res.status(400).json({ error: error.message })
		} else {
			return res.status(500).json({ error: error.message })
		}
	}
}

export const logoutUser = async (req, res) => {
	res.clearCookie('authToken')
	res.status(200).json({ message: 'Logged out successfully' })
}

export const getCurrentUser = async (req, res) => {
	const token = req.cookies.authToken;
	if (!token) return res.status(401).json({ error: 'Unauthorized' });
	try {
		 const decoded = jwt.verify(token, process.env.JWT_SECRET);
		 const user = await User.findByPk(decoded.user_id);
		 if (!user) return res.status(404).json({ error: 'User not found' });
		 res.json({ user });
	} catch (error) {
		 if (error.name === 'TokenExpiredError') {
				return res.status(401).json({ error: 'Token expired' });
		 }
		 return res.status(500).json({ error: error.message });
	}
}

export const getUserProfile = async (req, res) => {}


export const updateUser = async (req, res) => {
	try {
	} catch (error) {}
}

export const deleteUser = async (req, res) => {
	try {
	} catch (error) {}
}
