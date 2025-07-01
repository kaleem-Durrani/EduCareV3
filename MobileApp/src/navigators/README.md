# Navigators Directory

Based on the mobile app guidelines, the navigation structure is:

## Navigation Architecture:

- **No Tab Navigation**: Both Parent and Teacher apps use stack navigation only
- **Home-Based Navigation**: Each role has a home screen with 18 module options in 3x6 grid
- **Module Access**: All modules are accessed directly from home screen

## Navigator Files:

- `RootNavigator.tsx` - Main app navigator (Auth vs App)
- `AuthNavigator.tsx` - Login and Forgot Password
- `ParentNavigator.tsx` - Parent stack with all 18 modules
- `TeacherNavigator.tsx` - Teacher stack with all 18 modules (some with edit rights)

## Parent Modules (18 total):

1. Basic Information (view-only)
2. Contacts (view-only)
3. Weekly Menu (view-only)
4. Weekly Report (view-only)
5. Monthly Plan (view-only)
6. My Box (view-only)
7. My Documents (view-only)
8. Activities (view-only)
9. Wall (view-only)
10. Notes (view-only)
11. Lost Items (view-only)
12. Health (view-only)
13. Payment (view-only)
14. Driver (needs clarification)
15. Notifications
16. Settings
17. Contact (WhatsApp integration)
18. Feedback

## Teacher Modules (18 total):

Same modules but with edit rights for:

- Weekly Report (create/edit)
- My Box (edit for their students)
- Activities (create/edit)
- Wall (create posts)
- Notes (create/edit for their students)
