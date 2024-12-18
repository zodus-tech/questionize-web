import { api } from './api'
import { Department } from '@/interfaces/department'

export const departmentService = {
  async getAllDepartments() {
    const { data } = await api.get('/department/all')
    const filteredDepartments = data.content.filter(
      (department: Department) => department.name.toLowerCase() !== 'admin',
    )
    return filteredDepartments
  },

  async createDepartment(name: string) {
    const { data } = await api.post('/department/create', { name })
    return data
  },

  async deleteDepartment(id: string) {
    await api.delete(`/department/delete/${id}`)
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateDepartment(id: string, name: string) {
    await api.patch(`/department/update/${id}`, { name })
  },
}
