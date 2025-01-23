import { Request, Response } from "express";
import { PrismaClient, status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllOrders = async (request: Request, response: Response) => {
  try {
    const { search, status, start_date, end_date } = request.query;

        const filterConditions: any = { 
            OR: [
                { customer: { contains: search?.toString() || "" } },
                { table_number: { contains: search?.toString() || "" } }
            ]
        };

        if (status) {
            filterConditions.status = status.toString();
        }

        if (start_date && end_date) {
            filterConditions.createdAt = {
                gte: new Date(start_date.toString()),
                lte: new Date(end_date.toString())
            };
        }

        const allOrders = await prisma.order.findMany({
            where: filterConditions,
            orderBy: { createdAt: "desc" },
            include: { listDetail: true }
        });
    return response
      .json({
        status: true,
        data: allOrders,
        message: `List order telah diterima`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};

export const createOrder = async (request: Request, response: Response) => {
  try {
    /** get requested data (data has been sent from request) */
    const { customer, table_number, payment_met, status, orderlists } = request.body;
    const user = request.body.user;
    const uuid = uuidv4();

    /**
     * assume that "orderlists" is an array of object that has keys:
     * menuId, quantity, note
     * */

    /** loop details of order to check menu and count the total price */
    let total_price = 0;
    for (let index = 0; index < orderlists.length; index++) {
      const { menuId } = orderlists[index];
      const detailMenu = await prisma.menu.findFirst({
        where: {
          id: menuId,
        },
      });
      if (!detailMenu) return response.status(200).json({
          status: false,
          message: `Menu with id ${menuId} is not found`,
        });
      total_price += detailMenu.price * orderlists[index].quantity;
    }

    /** process to save new order */
    const newOrder = await prisma.order.create({
      data: {
        uuid,
        customer,
        table_number,
        total_price,
        payment_met,
        status,
        userId: user.id,
      },
    });

    /** loop details of Order to save in database */
    for (let index = 0; index < orderlists.length; index++) {
      const uuid = uuidv4();
      const { menuId, quantity, note } = orderlists[index];
      await prisma.order_list.create({
        data: {
          uuid,
          orderId: newOrder.idOrder,
          menuId: Number(menuId),
          quantity: Number(quantity),
          note,
        },
      });
    }
    return response
      .json({
        status: true,
        data: newOrder,
        message: `New Order has created`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const updateStatusOrder = async (req: Request, res: Response) => {
  try {
      const { id } = req.params
      const { status } = req.body

      const findOrder = await prisma.order.findFirst({ where: { idOrder: Number(id) } })
      if (!findOrder) return res
          .status(200)
          .json({
              status: false,
              message: "Order tidak ditemukan"
          })

      const editedUser = await prisma.order.update({
          data: {
              status: status || findOrder.status
          },
          where: { idOrder: Number(id) }
      })

      return res.json({
          status: true,
          user: editedUser,
          message: 'Order telah diupdate'
      }).status(200)
  } catch (error) {
      return res
          .json({
              status: false,
              message: `Terjadi sebuah kesalahan ${error}`
          })
          .status(400)
  }
}

export const deleteOrder = async (request: Request, response: Response) => {
  try {
    /** get id of order's id that sent in parameter of URL */
    const { id } = request.params;

    /** make sure that data is exists in database */
    const findOrder = await prisma.order.findFirst({
      where: { idOrder: Number(id) },
    });
    if (!findOrder)
      return response
        .status(200)
        .json({ status: false, message: `Order tidak ditemukan` });

    /** process to delete details of order */
    let deleteOrderList = await prisma.order_list.deleteMany({
      where: { orderId: Number(id) },
    });
    /** process to delete of Order */
    let deleteOrder = await prisma.order.delete({
      where: { idOrder: Number(id) },
    });

    return response
      .json({
        status: true,
        data: deleteOrder,
        message: `Order has deleted`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};
