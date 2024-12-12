import { api } from './api'

export const departmentService = {
  async getAllDepartments() {
    const { data } = await api.get('/department/all')
    return data.content
  },

  async createDepartment(name: string) {
    const { data } = await api.post('/department/create', { name })
    return data
  },

  async deleteDepartment(id: number) {
    await api.delete(`/department/delete/${id}`)
  },
}
