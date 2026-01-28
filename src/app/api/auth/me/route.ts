// import { NextResponse } from 'next/server';
// import { verifyJwt } from '@/lib/jwt';

// export async function GET(req: Request) {
//   const token = req.cookies.get('token')?.value;

//   if (!token) {
//     return NextResponse.json(
//       { message: 'Unauthorized' },
//       { status: 401 }
//     );
//   }

//   try {
//     const decoded = verifyJwt(token);
//     return NextResponse.json(decoded);
//   } catch {
//     return NextResponse.json(
//       { message: 'Token invalid' },
//       { status: 401 }
//     );
//   }
// }
