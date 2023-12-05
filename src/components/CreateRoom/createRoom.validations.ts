import { z, object, string, record, number } from 'zod';

export const ClassroomSchema = object({
  classRoomName: string(),
  quizzes: record(
    object({
      quizId: string(),
    })
  ),
  students: record(
    object({
      uid: string(),
    })
  ),
  teacher: object({
    uid: string(),
    username: string(),
  }),
});

const RequiredClassroomSchema = ClassroomSchema.required();

export type Classroom = z.infer<typeof RequiredClassroomSchema>;

export const validateClassroom = (data: unknown): Classroom => {
  return RequiredClassroomSchema.parse(data);
};
