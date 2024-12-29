import { Request, Response } from "express"
import { prisma } from "../prisma/prisma"
import { Prisma, Tasks } from "@prisma/client"

export const createTasks = async (req: Request, res: Response) => {
  console.log(req.body)
  try {
    const { title, description }: Tasks = await req.body
    console.log("🚀 ~ createTasks ~ title:", title, description)
    const tasks = await prisma.tasks.create({
      data: {
        title,
        description,
        completed_at: null,
        updated_at: new Date()
      }
    })
    res.status(201).json(tasks)
  } catch (error) {
    console.log("🚀 ~ createTasks ~ error:", error)
    res.status(500).json(error)
  }
}

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.query

    const or: Prisma.TasksWhereInput = title || description
      ? {
        OR: [
          { title: { contains: title as string } },
          { description: { contains: description as string } }
        ],
      }
      : {}
    // console.dir(or, {
    //   showHidden: true,
    //   depth:null,
    //   colors: true
    // })
    const tasks = await prisma.tasks.findMany({
      where: {
        ...or
      },
    })
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const putTasks = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body
    console.log("🚀 ~ putTasks ~ description:", description)
    console.log("🚀 ~ putTasks ~ title:", title)
    let { id }: any = req.params
    id = Number(id)
    console.log("🚀 ~ putTasks ~ id:", id)
    if (title && description) {
      const hasId = await prisma.tasks.findMany({
        where: { id }
      })
      console.log("🚀 ~ putTasks ~ hasId:", hasId.length)

      if (hasId.length != 0) {
        const tasks = await prisma.tasks.update({
          where: { id },
          data: {
            title,
            description,
            completed_at: null,
            updated_at: new Date()
          }
        })
        res.status(200).json({
          message: "Atualizado com sucesso",
          tasks
        })
      } else {
        res.status(400).json({
          message: "Não existe dados com esse id"
        })
      }
    } else {
      res.status(400).json({
        message: "Deve ser enviado titulo e descrição"
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

export const deleteTasks = async (req: Request, res: Response) => {
  try {
    let { id }: any = req.params
    id = Number(id)
    const hasId = await prisma.tasks.findMany({
      where: { id },
    })
    if (hasId.length != 0) {
      console.log("🚀 ~ putTasks ~ hasId:", hasId.length)
      const tasks = await prisma.tasks.delete({
        where: { id }
      })
      res.status(200).json({
        message: "Deletado com sucesso",
        tasks
      })
    } else {
      res.status(400).json({
        message: "Não existe dados com esse id"
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

export const patchTasks = async (req: Request, res: Response) => {
  try {
    let { id }: any = req.params
    id = Number(id)
    const hasId = await prisma.tasks.findMany({
      where: { id }
    })
    if (hasId.length != 0) {
      console.log("🚀 ~ putTasks ~ hasId:", hasId.length)
      const tasks = await prisma.tasks.update({
        where: { id },
        data: {
          completed_at: new Date(),
          updated_at: new Date()
        }
      })
      res.status(200).json({
        message: "Completado tastks com sucesso",
        tasks
      })
    } else {
      res.status(400).json({
        message: "Não existe dados com esse id"
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

export const exportTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.tasks.findMany()
    if (tasks.length != 0) {
      res.status(200).json(tasks);
    } else {
      res.status(400).json({
        message: "Não há dados"
      })
    }



  } catch (error) {
    res.status(500).json(error);
  }
};
