class Users::SessionsController < Devise::SessionsController
  # respond_to :json
  
  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?
    
    render json: {
      message: 'Logged in successfully',
      user: {
        id: resource.id,
        email: resource.email,
        admin: resource.admin
      }
    }, status: :ok
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    yield if block_given?
    
    render json: { message: 'Logged out successfully' }, status: :ok
  end

  private

  def respond_with(resource, _opts = {})
    render json: {
      message: 'Logged in successfully',
      user: {
        id: resource.id,
        email: resource.email,
        admin: resource.admin
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    render json: { message: 'Logged out successfully' }, status: :ok
  end
end

