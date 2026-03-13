import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "@/utils/dbConnect";

export const authOptions = {
    // 使用 JWT 策略管理 session
    session: {
        strategy: "jwt",
    },

    providers: [
        // 邮箱密码登录
        CredentialsProvider({
            async authorize(credentials) {
                await dbConnect();
                const { email, password } = credentials;

                // 查找用户
                const user = await User.findOne({ email });

                // 用户不存在或没有密码
                if (!user?.password) {
                    throw new Error("Please login via the method used to sign up");
                }

                // 验证密码
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }

                return user;
            },
        }),

        // Google 登录
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        // GitHub 登录
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],

    callbacks: {
        // 登录回调：第三方登录时自动创建用户
        async signIn({ user }) {
            await dbConnect();
            const { email } = user;

            // 查找数据库中是否已有该用户
            let dbUser = await User.findOne({ email });

            // 没有则自动创建
            if (!dbUser) {
                dbUser = await User.create({
                    email,
                    name: user?.name,
                    image: user?.image,
                });
            }

            return true;
        },

        // JWT 回调：把用户信息和角色写入 token
        jwt: async ({ token }) => {
            const userByEmail = await User.findOne({ email: token.email });

            if (userByEmail) {
                // 密码不放进 token
                userByEmail.password = undefined;

                token.user = {
                    ...userByEmail.toObject(),
                    role: userByEmail.role || "user",
                };
            }

            return token;
        },

        // Session 回调：把 token 里的用户信息同步到 session
        session: async ({ session, token }) => {
            session.user = {
                ...token.user,
                role: token.user?.role || "user",
            };
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,

    // 自定义登录页面路径
    pages: {
        signIn: "/login",
    },
};