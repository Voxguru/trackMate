//
//  HypertrackService.swift
//  HyperTrack
//
//  Created by Ravi Jain on 8/5/17.
//  Copyright © 2017 HyperTrack. All rights reserved.
//

import UIKit
import CoreLocation
import CocoaLumberjack

class HypertrackService: NSObject {

    static let sharedInstance = HypertrackService()
    let stopBatchDuration = 30 * 60
    let tripBatchDuration = 5 * 60
    let actionCreationBatchDuration = 5
    let actionCompletionBatchDuration = 5
    let activityTTL = 24 * 60 * 60
    let actionEventsTTL = 5 * 60

    let requestManager: RequestManager

    override init() {
        EventsDatabaseManager.sharedInstance.createEventsTable()
        self.requestManager = RequestManager()
        super.init()
        checkSDKControls()
        registerNotifications()
    }
    
   func setPublishableKey(publishableKey:String) {
        Settings.setPublishableKey(publishableKey: publishableKey)
    }
    
    func getPublishableKey() -> String? {
        return Settings.getPublishableKey()
    }

   
    func findPlaces(searchText:String?, cordinate: CLLocationCoordinate2D? , completionHandler: ((_ places: [HyperTrackPlace]?, _ error: HyperTrackError?) -> Void)?){
        self.requestManager.findPlaces(searchText: searchText, cordinate: cordinate, completionHandler: completionHandler)
    }
    
    
    func createPlace(geoJson : HTGeoJSONLocation,completionHandler: ((_ place: HyperTrackPlace?, _ error: HyperTrackError?) -> Void)?){
        self.requestManager.createPlace(geoJson: geoJson, completionHandler: completionHandler)
    }
    
    func updateSDKControls() {
        guard let userId = Settings.getUserId() else { return }
        
        self.requestManager.getSDKControls(userId: userId) { (controls, error) in
            if (error == nil) {
                if let controls = controls {
                    // Successfully updated the SDKControls
                    DDLogInfo("SDKControls for user: \(userId ) updated to batch_duration: \(controls.batchDuration ?? 0) displacement: \(controls.minimumDisplacement ?? 0) ttl: \(controls.ttl ?? 0)")
                    self.processSDKControls(controls: controls)
                }
            }
        }
    }

    
    func getPlacelineActivity(date: Date? = nil, userID : String? = nil, completionHandler: @escaping (_ placeline: HyperTrackPlaceline?, _ error: HyperTrackError?) -> Void) {
        // TODO: this method should not be in Transmitter, but needs access to request manager
        var user = userID
        if (user == nil){
            user = Settings.getUserId()
        }

        guard let userId = user else {
            completionHandler(nil, HyperTrackError(HyperTrackErrorType.userIdError))
            return
        }
        
        requestManager.getUserPlaceline(date: date, userId: userId) { (placeline, error) in
            if (error != nil) {
                completionHandler(nil, error)
                return
            }
            
            completionHandler(placeline, nil)
        }
    }
    
    func getETA(expectedPlaceCoordinates: CLLocationCoordinate2D, vehicleType: String?,
                completionHandler: @escaping (_ eta: NSNumber?, _ error: HyperTrackError?) -> Void) {
        var vehicleTypeParam = vehicleType
        if (vehicleTypeParam == nil) {
            vehicleTypeParam = "car"
        }
        
        Transmitter.sharedInstance.getCurrentLocation { (currentLocation, error) in
            if (currentLocation != nil) {
                self.requestManager.getETA(currentLocationCoordinates: currentLocation!.coordinate,
                                           expectedPlaceCoordinates: expectedPlaceCoordinates,
                                           vehicleType: vehicleTypeParam!,
                                           completionHandler: completionHandler)
            } else {
                completionHandler(nil, error)
            }
        }
    }
    
    func processSDKControls(controls: HyperTrackSDKControls) {
        // Process controls
        if let runCommand = controls.runCommand {
            
            if runCommand == "GO_OFFLINE" {
                // Stop tracking from the backend
                if Transmitter.sharedInstance.isTracking {
                    HyperTrack.stopTracking()
                }
            } else if runCommand == "FLUSH" {
                self.flushCachedData()
            } else if runCommand == "GO_ACTIVE" {
                // nothing to do as controls will handle
            } else if runCommand == "GO_ONLINE" {
                // nothing to do as controls will handle
            }
        }
        
        self.onNewSDKControls(controls: controls)
    }
    
    func changeSDKControls(controls: HyperTrackSDKControls){
        DDLogInfo("changing sdk controls to \(controls.toDict().description)")
        HyperTrackSDKControls.saveControls(controls: controls)
        Transmitter.sharedInstance.refreshTransmitterWithControls(controls: controls)
        Transmitter.sharedInstance.refreshTransmitter()
    }
    
    
    func onNewSDKControls(controls: HyperTrackSDKControls, force: Bool = false){
        if force == true{
            changeSDKControls(controls: controls)
            return
        }
        if let currentBatchDuration = Settings.getBatchDuration(){
            if let newBatchDuration = controls.batchDuration{
                if Double(newBatchDuration) < currentBatchDuration {
                    changeSDKControls(controls: controls)
                }
            }
        }else{
            changeSDKControls(controls: controls)
      }
    }
    
    func registerNotifications(){
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(self.onStopStarted),
                                               name: NSNotification.Name(rawValue: HTConstants.HTStopStartedNotification), object: nil)
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(self.onStopEnded),
                                               name: NSNotification.Name(rawValue: HTConstants.HTStopEndedNotification), object: nil)
        
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(self.onActionCreated),
                                               name: NSNotification.Name(rawValue: HTConstants.HTActionCreatedNotification), object: nil)
        
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(self.onActionEnded),
                                               name: NSNotification.Name(rawValue: HTConstants.HTActionIsNearCompletionNotification), object: nil)
    }
    
    func checkSDKControls(){
        if Settings.isAtStop {
            onStopStarted()
        }else{
            onStopEnded()
        }
    }
    
    func onStopStarted(){
      DDLogInfo("recieved stop started notification")
       let controls =   HyperTrackSDKControls.init(userId:HTUserService.sharedInstance.getUserId(), runCommand: "GO_ACTIVE", ttl: activityTTL, minimumDuration: 0, minimumDisplacement: 50, batchDuration: stopBatchDuration)
        onNewSDKControls(controls: controls, force: true)
    }
    
    func onStopEnded(){
        DDLogInfo("recieved stop eded notification")
        let controls =   HyperTrackSDKControls.init(userId:HTUserService.sharedInstance.getUserId(), runCommand: "GO_ACTIVE", ttl: activityTTL, minimumDuration: 0, minimumDisplacement: 50, batchDuration: tripBatchDuration)
        onNewSDKControls(controls: controls)
    }
    
    func onActionCreated(){
        DDLogInfo("recieved action created notification")
        let controls =   HyperTrackSDKControls.init(userId:HTUserService.sharedInstance.getUserId(), runCommand: "GO_ACTIVE", ttl: actionEventsTTL, minimumDuration: 0, minimumDisplacement: 50, batchDuration: actionCreationBatchDuration)
        onNewSDKControls(controls: controls)
    }
    
    func onActionEnded(){
        DDLogInfo("recieved action ended notification")
        let controls =   HyperTrackSDKControls.init(userId:HTUserService.sharedInstance.getUserId(), runCommand: "GO_ACTIVE", ttl: actionEventsTTL, minimumDuration: 0, minimumDisplacement: 50, batchDuration: actionCompletionBatchDuration)
        onNewSDKControls(controls: controls)
    }
    
    func flushCachedData() {
        self.requestManager.postEvents(flush: true)
    }

    public func resetControls() {
        HyperTrackSDKControls.clearSavedControls()
        self.checkSDKControls()
    }

}
