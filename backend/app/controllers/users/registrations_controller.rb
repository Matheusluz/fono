class Users::RegistrationsController < Devise::RegistrationsController
  # respond_to :json
  
  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    
    if resource.persisted?
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        
        render json: {
          message: 'Signed up successfully',
          user: {
            id: resource.id,
            email: resource.email,
            admin: resource.admin
          }
        }, status: :created
      else
        expire_data_after_sign_in!
        
        render json: {
          message: 'Signed up successfully but needs confirmation',
          user: {
            id: resource.id,
            email: resource.email,
            admin: resource.admin
          }
        }, status: :created
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      
      render json: {
        message: 'Signed up failed',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        message: 'Signed up successfully',
        user: {
          id: resource.id,
          email: resource.email,
          admin: resource.admin
        }
      }, status: :created
    else
      render json: {
        message: 'Signed up failed',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
end

