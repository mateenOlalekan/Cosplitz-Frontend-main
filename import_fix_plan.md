# Import Issues Fix Plan

## Critical Issues (Must Fix)

### 1. Missing SplitzDescriptionPage Component

**Location**: src/App.jsx (Line 33)
**Issue**: Route references non-existent component
**Solution**: Create the missing component or update route

### 2. Duplicate Split Detail Imports

**Location**: src/App.jsx (Lines 26-27)
**Issue**: Both SplitDetailPage and SplitCardPage import same file
**Solution**: Consolidate to single import

## Medium Priority Issues

### 3. Asset Import Path Corrections

**Files**:

- src/pages/Auth/ForgetPassword/index.jsx
- src/pages/Auth/Login/index.jsx
  **Issue**: Import paths are 2 levels too deep (using ../../../ instead of ../../)
  **Solution**: Fix relative paths

### 4. Missing React Import

**Location**: src/pages/Auth/Register/RegistrationForm.jsx
**Issue**: Uses JSX but doesn't import React
**Solution**: Add React import

## Low Priority Issues

### 5. Unnecessary Lazy Loading

**Location**: src/routes/ProtectedRoute.jsx
**Issue**: Loading component uses React.lazy unnecessarily
**Solution**: Direct import

## Implementation Steps

1. **Create Missing Component**: Create SplitzDescriptionPage.jsx or update App.jsx route
2. **Fix App.jsx Imports**: Consolidate duplicate imports and fix routing
3. **Fix Asset Paths**: Correct relative paths in auth pages
4. **Add Missing Imports**: Add React import where needed
5. **Test Changes**: Verify all imports work correctly

## Files to Edit

- src/App.jsx (Critical - Fix routes and imports)
- src/pages/Auth/ForgetPassword/index.jsx (Fix asset paths)
- src/pages/Auth/Login/index.jsx (Fix asset paths)
- src/pages/Auth/Register/RegistrationForm.jsx (Add React import)
- src/routes/ProtectedRoute.jsx (Optional - Simplify Loading import)

## Verification Steps

After fixes:

1. Check all imports resolve correctly
2. Verify no missing component errors
3. Test that routes work as expected
4. Ensure asset images load properly
