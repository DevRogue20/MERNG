const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign(
        {
        id: user.id,
        email: user.email,
        username: user.username
    }, 
    SECRET_KEY,
    {expiresIn: '1h'}
    );
}

module.exports = {
    Mutation: {
        async login(_, { username, password }){
            const {errors, valid} = validateLoginInput(username, password);

            if(!valid){
                throw new UserInputError('Error', {errors});
            }

            const user = await User.findOne({ username });
            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare (password, user.password);
            if(!match){
                errors.general = 'Invalid Credentials';
                throw new UserInputError('Invalid Credentials', { errors });    
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        // Register new user
        async register(_,{ registerInput: {username, email, password, confirmPassword } }) {

            // Validate user data
            const { valid, errors } = await validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', { errors });
            }

            // Make sure user doesn't already exist
            const user = await User.findOne({ username });
            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }

            // Make sure email doesn't already exist
            const emailCheck = await User.findOne({ email });
            if(emailCheck){
                throw new UserInputError('Email already in use', {
                    errors: {
                        email: 'Email already in use'
                    }
                });
            }
            
            // Hash password
            password = await bcrypt.hash(password, 12);
            
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },
    }
};