import { Injectable } from '@nestjs/common';
import { Device, User } from '@prisma/client';
import { PrismaService } from 'api/libs/prisma/prisma.service';

@Injectable()
export class UserDeviceRepo {
    constructor(private readonly prisma: PrismaService) { }

    async findOneById(id: string) {
        return await this.prisma.device.findUnique({
            where: { id },
        });
    }

    async findOneByUserIdAndDeviceId(user: Pick<User, 'id'>, device: Pick<Device, 'deviceId'>) {
        return await this.prisma.device.findUnique({
            where: {
                userId_deviceId: {
                    deviceId: device.deviceId,
                    userId: user.id
                }
            }
        });
    }

    async createDevice(data: Pick<Device, "deviceId" | "resetToken" | "userId">) {
        console.log(data);
        return await this.prisma.device.create({
            data: {
                deviceId: data.deviceId,
                resetToken: data.resetToken,
                userId: data.userId,
            }
        });
    }

    async updateResetToken(id: string, token: string) {
        return await this.prisma.device.update({
            where: { id },
            data: {
                resetToken: token,
            }
        });
    }
}
