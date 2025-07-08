import { ApiService } from './api';
import { ApiResponse } from '../types';

// Driver types for mobile app
export interface Vehicle {
  make: string;
  model: string;
  year?: number;
  plateNumber: string;
  color?: string;
  capacity: number;
  photoUrl?: string;
}

export interface RouteStop {
  name: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  estimatedTime: string;
  order: number;
}

export interface Route {
  name: string;
  description?: string;
  stops: RouteStop[];
}

export interface Schedule {
  pickupTime: string;
  dropoffTime: string;
  workingDays: string[];
}

export interface StudentAssignment {
  student_id: {
    _id: string;
    fullName: string;
    rollNum: number;
  };
  pickupStop: string;
  dropoffStop: string;
  active: boolean;
  assignedDate: string;
}

export interface EmergencyContact {
  name?: string;
  phone?: string;
  relationship?: string;
}

export interface Driver {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  photoUrl?: string;
  vehicle: Vehicle;
  route: Route;
  schedule: Schedule;
  assignedStudents: StudentAssignment[];
  emergencyContact?: EmergencyContact;
  status: 'active' | 'inactive' | 'maintenance';
  notes?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ParentDriverInfo {
  _id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  vehicle: {
    make: string;
    model: string;
    color?: string;
    plateNumber: string;
    photoUrl?: string;
  };
  route: {
    name: string;
    description?: string;
  };
  schedule: Schedule;
  studentAssignment: {
    pickupStop: string;
    dropoffStop: string;
  };
  emergencyContact?: EmergencyContact;
}

export interface CreateDriverData {
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  vehicle: Omit<Vehicle, 'photoUrl'>;
  route: Route;
  schedule: Schedule;
  emergencyContact?: EmergencyContact;
  notes?: string;
}

export interface UpdateDriverData {
  name?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  vehicle?: Partial<Vehicle>;
  route?: Partial<Route>;
  schedule?: Partial<Schedule>;
  emergencyContact?: EmergencyContact;
  status?: 'active' | 'inactive' | 'maintenance';
  notes?: string;
}

export interface AssignStudentData {
  student_id: string;
  pickupStop: string;
  dropoffStop: string;
}

export interface DriverFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  route?: string;
}

export interface DriverPagination {
  currentPage: number;
  totalPages: number;
  totalDrivers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaginatedDriversResponse {
  drivers: Driver[];
  pagination: DriverPagination;
}

export interface DriverStatistics {
  totalDrivers: number;
  activeDrivers: number;
  inactiveDrivers: number;
  maintenanceDrivers: number;
  totalAssignedStudents: number;
  totalCapacity: number;
  capacityUtilization: number;
}

/**
 * Driver service for handling all driver-related API calls in mobile app
 */
export const driverService = {
  /**
   * Get all drivers with pagination and filters (Admin/Teacher)
   * Uses endpoint: GET /api/drivers
   */
  getAllDrivers: async (filters?: DriverFilters): Promise<ApiResponse<PaginatedDriversResponse>> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.route) params.append('route', filters.route);

    const queryString = params.toString();
    const url = queryString ? `/drivers?${queryString}` : '/drivers';

    return ApiService.get<PaginatedDriversResponse>(url);
  },

  /**
   * Get driver by ID (Admin/Teacher)
   * Uses endpoint: GET /api/drivers/:driver_id
   */
  getDriverById: async (driverId: string): Promise<ApiResponse<Driver>> => {
    return ApiService.get<Driver>(`/drivers/${driverId}`);
  },

  /**
   * Create new driver (Admin only)
   * Uses endpoint: POST /api/drivers
   */
  createDriver: async (driverData: CreateDriverData): Promise<ApiResponse<Driver>> => {
    return ApiService.post<Driver>('/drivers', driverData);
  },

  /**
   * Update driver (Admin only)
   * Uses endpoint: PUT /api/drivers/:driver_id
   */
  updateDriver: async (driverId: string, driverData: UpdateDriverData): Promise<ApiResponse<Driver>> => {
    return ApiService.put<Driver>(`/drivers/${driverId}`, driverData);
  },

  /**
   * Delete driver (Admin only)
   * Uses endpoint: DELETE /api/drivers/:driver_id
   */
  deleteDriver: async (driverId: string): Promise<ApiResponse<null>> => {
    return ApiService.delete<null>(`/drivers/${driverId}`);
  },

  /**
   * Assign student to driver (Admin only)
   * Uses endpoint: POST /api/drivers/:driver_id/assign-student
   */
  assignStudentToDriver: async (
    driverId: string, 
    assignmentData: AssignStudentData
  ): Promise<ApiResponse<Driver>> => {
    return ApiService.post<Driver>(`/drivers/${driverId}/assign-student`, assignmentData);
  },

  /**
   * Remove student from driver (Admin only)
   * Uses endpoint: DELETE /api/drivers/:driver_id/students/:student_id
   */
  removeStudentFromDriver: async (
    driverId: string, 
    studentId: string
  ): Promise<ApiResponse<Driver>> => {
    return ApiService.delete<Driver>(`/drivers/${driverId}/students/${studentId}`);
  },

  /**
   * Get driver statistics (Admin/Teacher)
   * Uses endpoint: GET /api/drivers/statistics
   */
  getDriverStatistics: async (): Promise<ApiResponse<DriverStatistics>> => {
    return ApiService.get<DriverStatistics>('/drivers/statistics');
  },

  /**
   * Get driver information for parent's child (Parent only)
   * Uses endpoint: GET /api/drivers/parent/:student_id
   */
  getDriverForParent: async (studentId: string): Promise<ApiResponse<ParentDriverInfo | null>> => {
    return ApiService.get<ParentDriverInfo | null>(`/drivers/parent/${studentId}`);
  },
};
