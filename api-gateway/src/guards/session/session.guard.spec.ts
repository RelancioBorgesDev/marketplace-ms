import { SessionGuard } from './session.guard';
import { AuthService } from '../../auth/service/auth.service';

describe('SessionGuard', () => {
  it('should be defined', () => {
    const mockAuthService = {
      validateSessionToken: jest.fn(),
    } as unknown as AuthService;

    expect(new SessionGuard(mockAuthService)).toBeDefined();
  });
});
