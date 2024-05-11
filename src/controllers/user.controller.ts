import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { RegisterPayload } from "../models/user.model";

class UserController {

    public findUser = async (email: string) => {
        const prisma = new PrismaClient();
        const matchingUser = await prisma.users.findFirst({
            where: {
                email: email
            }
        });
        return matchingUser;
    }


    public createUser = async (user: RegisterPayload) => {
        const prisma = new PrismaClient();
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(user.password, salt);
      
            await prisma.users.create({
                data: {
                    name: user.username,
                    email: user.email,
                    password: hashedPassword,
                    skin: {
                        create: {
                            link: process.env.DEFAULT_SKIN_LINK!,
                        }
                    }
                }
            });
            console.log(`User ${user.username} (${user.email}) has been created successfully`);
        } catch(e) {
            throw e;
        } finally {
            await prisma.$disconnect();
        }
    }

}

export default new UserController();