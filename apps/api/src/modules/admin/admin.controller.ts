import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
// import { JwtAuthGuard } from '../auth/auth.guard';
// import { AdminGuard } from './admin.guard';

@Controller('admin')
// @UseGuards(JwtAuthGuard, AdminGuard) // Закомментировано для тестовой разработки
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Demos Management
  @Get('demos')
  async getDemos(@Query() query: any) {
    return this.adminService.getDemos(query);
  }

  @Post('demos')
  async createDemo(@Body() demoData: any) {
    return this.adminService.createDemo(demoData);
  }

  @Put('demos/:id')
  async updateDemo(@Param('id') id: string, @Body() demoData: any) {
    return this.adminService.updateDemo(id, demoData);
  }

  @Delete('demos/:id')
  async deleteDemo(@Param('id') id: string) {
    return this.adminService.deleteDemo(id);
  }

  // Orders Management
  @Get('orders')
  async getOrders(@Query() query: any) {
    return this.adminService.getOrders(query);
  }

  @Post('orders')
  async createOrder(@Body() orderData: any) {
    return this.adminService.createOrder(orderData);
  }

  @Put('orders/:id')
  async updateOrder(@Param('id') id: string, @Body() orderData: any) {
    return this.adminService.updateOrder(id, orderData);
  }

  @Delete('orders/:id')
  async deleteOrder(@Param('id') id: string) {
    return this.adminService.deleteOrder(id);
  }

  // Vendors Management
  @Get('vendors')
  async getVendors() {
    return this.adminService.getVendors();
  }

  @Post('vendors')
  async createVendor(@Body() vendorData: any) {
    return this.adminService.createVendor(vendorData);
  }

  @Put('vendors/:id')
  async updateVendor(@Param('id') id: string, @Body() vendorData: any) {
    return this.adminService.updateVendor(id, vendorData);
  }

  @Delete('vendors/:id')
  async deleteVendor(@Param('id') id: string) {
    return this.adminService.deleteVendor(id);
  }

  // Analytics
  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('analytics/orders')
  async getOrderAnalytics() {
    return this.adminService.getOrderAnalytics();
  }

  @Get('analytics/demos')
  async getDemoAnalytics() {
    return this.adminService.getDemoAnalytics();
  }

  // Settings
  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  async updateSettings(@Body() settingsData: any) {
    return this.adminService.updateSettings(settingsData);
  }
}
