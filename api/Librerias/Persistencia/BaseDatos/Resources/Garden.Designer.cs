﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BaseDatos.Resources {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "16.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Garden {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Garden() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("BaseDatos.Resources.Garden", typeof(Garden).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to IF EXISTS ( SELECT * 
        ///            FROM   sysobjects 
        ///            WHERE  id = object_id(N&apos;[Gargen].[GetGrupos]&apos;) 
        ///                   and OBJECTPROPERTY(id, N&apos;IsProcedure&apos;) = 1 )
        ///BEGIN
        ///    DROP PROCEDURE Gargen.[GetGrupos]
        ///END
        ///go
        ///-- =============================================
        ///-- Author:		&lt;Author,,Name&gt;
        ///-- Create date: &lt;Create Date,,&gt;
        ///-- Description:	&lt;Description,,&gt;
        ///-- =============================================
        ///create PROCEDURE Gargen.[GetGrupos]
        ///	@empresa VARCHAR(10),@temporada VARCHAR(10), [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string Gargen__GetGrupos_ {
            get {
                return ResourceManager.GetString("Gargen__GetGrupos_", resourceCulture);
            }
        }
    }
}
