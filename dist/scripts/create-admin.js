"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'admin@vlsi.com';
    const password = 'admin123';
    const name = 'Admin User';
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        console.log('Admin user already exists!');
        console.log(`Email: ${existingUser.email}`);
        console.log(`Role: ${existingUser.role}`);
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created successfully!');
    console.log('=====================================');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${admin.role}`);
    console.log('=====================================');
    console.log('⚠️  Please change the password after first login!');
}
main()
    .catch((e) => {
    console.error('Error creating admin user:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=create-admin.js.map